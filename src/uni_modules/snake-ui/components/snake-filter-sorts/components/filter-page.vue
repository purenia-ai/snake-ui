<template>
  <view class="filter-container" :style="$snakeThemeStyle">
    <view class="scroll-panel" id="scroll-panel">
      <view class="list-box">
        <view class="left">
          <scroll-view
            scroll-y
            :style="{ height: scrollHeight + 'px' }"
            :scroll-into-view="leftIntoView"
            :scroll-with-animation="false">
            <view
              class="item"
              v-for="(item, index) in filterList"
              :key="index"
              :class="{ active: index == leftIndex }"
              :id="'left-' + index"
              :data-index="index"
              @tap.stop="leftTap">
              {{ item.name }}
            </view>
          </scroll-view>
        </view>
        <view class="main">
          <scroll-view
            v-if="filterList.length - 1 !== leftIndex"
            scroll-y
            :style="{ height: scrollHeight + 'px' }"
            :scroll-into-view="scrollInto"
            :scroll-with-animation="false"
            @scroll="mainScroll">
            <view class="item main-item" v-for="(item, index) in filterList" :key="index" :id="'item-' + index">
              <view class="title" v-if="item.value !== 'brandFilter'">
                <text>{{ item.name }}</text>
                <view class="pos-relative" v-if="item.desc">
                  <view class="next-icons icon-question-circle ml-10rpx" @click.stop="showTooltip = !showTooltip"></view>
                  <view class="tooltip" v-if="showTooltip">
                    <view class="p-14rpx" style="background-color: var(--snake-color-primary-light, #eafff5)">
                      <mp-html :content="item.desc"></mp-html>
                    </view>
                  </view>
                </view>
              </view>
              <view class="price-input-box" v-if="item.value === 'priceFilter'">
                <input
                  class="price-input-item"
                  placeholder="最低价"
                  v-model="priceValue.low"
                  placeholder-style="color: var(--snake-color-text-muted, #acacb7)"
                  @input="inputChange($event, item, 'low')" />
                <view class="line"></view>
                <input
                  class="price-input-item"
                  placeholder="最高价"
                  v-model="priceValue.high"
                  placeholder-style="color: var(--snake-color-text-muted, #acacb7)"
                  @input="inputChange($event, item, 'high')" />
              </view>

              <view class="tabs" v-if="item.value !== 'brandFilter'">
                <block v-for="(item2, index2) in item.children" :key="index2">
                  <view
                    class="tabs-item snake-ellipse-1"
                    :class="{
                      'tabs-item--active': filterParams[item.value].includes(item2.value),
                    }"
                    @click="selectHandle(item, item2)">
                    {{ item2.label }}
                  </view>
                </block>
              </view>
            </view>
            <view class="fill-last" :style="{ height: fillHeight + 'px' }"></view>
          </scroll-view>

          <view class="title" v-if="filterList[leftIndex]">
            <text>{{ filterList[leftIndex].name }}</text>
            <text class="fw-300">（已选{{ filterParams[filterList[leftIndex].value].length }}个）</text>
          </view>

          <internal-index-list
            v-if="filterList.length - 1 === leftIndex"
            ref="uIndexListRef"
            :indexList="indexList"
            activeColor="var(--snake-color-text, #26273a)"
            inactiveColor="var(--snake-color-text-muted, #acacb7)"
            :scrollTop="scrollTop">
            <block v-for="(item, index) in brandGroupList" :key="index">
              <internal-index-anchor
                :index="index"
                :text="indexList[index]"
                :customStyle="{ height: '44rpx', padding: '0 10px' }"></internal-index-anchor>

              <template v-for="(cell, cellIndex) in item" :key="cellIndex">
                <view
                  class="flex-items-center justify-between bg-white h-40rpx mt-10rpx pl-10rpx"
                  @click.stop="
                    selectHandle(filterList[leftIndex], {
                      value: cell,
                    })
                  ">
                  <view class="text-24rpx" hover-class="u-hover-class">{{ cell }}</view>
                  <view
                    class="next-icons icon-checkMark text-28rpx pr-96rpx snake-green fw-500"
                    v-if="filterParams.brandFilter.includes(cell)"></view>
                </view>
              </template>
              <view class="h-20rpx"></view>
            </block>
            <view class="h-120rpx"></view>
          </internal-index-list>
        </view>
      </view>
    </view>

    <snake-overlay :opacity="0" v-model="showTooltip" @click="showTooltip = false" :z-index="11" v-if="showTooltip"></snake-overlay>

    <!-- 底部按钮 -->
    <view class="filter-footer">
      <view class="flex-items-center" @click="isDefaultSave = !isDefaultSave">
        <text v-if="isDefaultSave" class="next-icons icon-selected snake-green"></text>
        <text v-else class="next-icons icon-notselected"></text>
        <text class="text-24rpx ml-10rpx">保存为默认筛选</text>
      </view>

      <view class="action">
        <snake-button type="primary" plain customStyle="width: 168rpx; height: 76rpx;" @click="resetFilter">重置</snake-button>
        <snake-button type="primary" customStyle="width: 228rpx; height: 76rpx; margin-left: 20rpx;" @click="confirmFilter">
          确定
        </snake-button>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @component FilterPage
 * @description 筛选排序组件内部使用的条件选择面板，负责选项联动、默认值恢复和结果确认。
 * @see /components/filter-sorts
 */

import { createCacheClient } from '../../../libs/adapters/cache';
import InternalIndexAnchor from '../../snake-index-anchor/snake-index-anchor.vue';
import InternalIndexList from '../../snake-index-list/snake-index-list.vue';
const cacheManager = createCacheClient('snake-filter-sorts');
export default {
  emits: ['confirm'],
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
  components: { InternalIndexAnchor, InternalIndexList },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    filters: {
      type: Object,
      default: () => ({}),
    },
    defaultParams: {
      type: Object,
      default: () => ({}),
    },
    // 页面滚动
    scrollTop: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      scrollHeight: 400,
      scrollTopSize: 0,
      fillHeight: 0, // 填充高度，用于最后一项低于滚动区域时使用
      leftArray: [],
      mainArray: [],
      topArr: [],
      leftIndex: 0,
      scrollInto: '',
      isDefaultSave: false,
      showTooltip: false,
      tagStyle: {
        text: '',
      },
      // 价格筛选
      priceValue: {
        low: '',
        high: '',
      },
      brandValues: [],
      filterList: [],
      filterParams: {},
    };
  },
  computed: {
    /* 计算左侧滚动位置定位 */
    leftIntoView() {
      return `left-${this.leftIndex > 3 ? this.leftIndex - 3 : 0}`;
    },
    /**
     * 获取品牌分组列表
     * @returns {Array} 品牌数据数组，按 hot -> 字母顺序 -> # 的顺序排列
     */
    brandGroupList() {
      const brandData = this.filters?.brandFilter;
      const indexList = Object.keys(brandData);
      const filteredIndexes = indexList.filter((e) => !['hot', '#'].includes(e));

      const result = filteredIndexes.map((key) => brandData[key]);

      // 如果存在 hot 分组，将其插入到开头
      if (indexList.includes('hot')) {
        result.unshift(brandData.hot);
      }

      // 如果存在 # 分组，将其追加到末尾
      if (indexList.includes('#')) {
        result.push(brandData['#']);
      }

      return result;
    },
    /**
     * 获取索引列表
     * @returns {Array} 索引数组，按 hot -> 字母顺序 -> # 的顺序排列
     */
    indexList() {
      const indexList = Object.keys(this.filters?.brandFilter);
      const filteredIndexes = indexList.filter((e) => !['hot', '#'].includes(e));

      const result = [...filteredIndexes];

      // 如果存在 hot 分组，将其插入到开头
      if (indexList.includes('hot')) {
        result.unshift('hot');
      }

      // 如果存在 # 分组，将其追加到末尾
      if (indexList.includes('#')) {
        result.push('#');
      }

      return result;
    },
  },
  watch: {
    show: {
      async handler(newVal) {
        // #ifdef H5
        document.body.style.overflow = newVal ? 'hidden' : 'unset';
        // #endif

        if (newVal) {
          await uni.$snake.sleep(500);
          await this.initScrollView();
          await this.initData();
          await uni.$snake.sleep(200);
          await this.getElementTop();
          if (this.leftIndex > 0) {
            this.scrollInto = '';
            this.$nextTick(() => {
              this.scrollInto = `item-${this.leftIndex}`;
            });
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    initData() {
      const filterParamsCache = cacheManager.get('filterParams') || {};

      const mainFilter = [
        ...(this.filters?.mainFilter || []),
        {
          name: '品牌',
          value: 'brandFilter',
        },
      ];

      this.filterList = mainFilter;

      const obj = {};
      this.filterList.forEach((item) => {
        obj[item.value] = (filterParamsCache?.[item.value]?.length && filterParamsCache[item.value]) || [];
        if (!obj[item.value].length) {
          const value = this.defaultParams?.[item.value] || [];
          obj[item.value] = Array.isArray(value) ? value : value.split?.(',');
        }
        this.filterParams = { ...obj };
      });
    },
    /* 初始化滚动区域 */
    initScrollView() {
      return new Promise((resolve) => {
        let view = uni.createSelectorQuery().in(this);

        // #ifdef MP-ALIPAY
        view = uni.createSelectorQuery();
        // #endif

        view
          .select('#scroll-panel')
          .boundingClientRect((res) => {
            this.scrollTopSize = res.top;
            this.scrollHeight = res.height;
            setTimeout(() => {
              resolve();
            }, 100);
          })
          .exec();
      });
    },
    /* 获取元素顶部信息 */
    getElementTop() {
      new Promise((resolve) => {
        let view = uni.createSelectorQuery().in(this);

        // #ifdef MP-ALIPAY
        view = uni.createSelectorQuery();
        // #endif

        view
          .selectAll('.main-item')
          .boundingClientRect((data) => {
            resolve(data);
          })
          .exec();
      }).then((res) => {
        const topArr = res.map((item) => {
          return item.top - this.scrollTopSize; /* 减去滚动容器距离顶部的距离 */
        });
        this.topArr = topArr;

        /* 获取最后一项的高度，设置填充高度。判断和填充时做了 +-20 的操作，是为了滚动时更好的定位 */
        const last = res[res.length - 1]?.height || 0;
        if (last - 20 < this.scrollHeight) {
          this.fillHeight = this.scrollHeight - last + 20;
        }
      });
    },
    /* 主区域滚动监听 */
    mainScroll(e) {
      // 节流方法
      clearTimeout(this.mainThrottle);
      this.mainThrottle = setTimeout(() => {
        scrollFn();
      }, 10);

      const scrollFn = () => {
        const top = e.detail.scrollTop;
        let index = 0;
        /* 查找当前滚动距离 */
        for (let i = this.topArr.length - 1; i >= 0; i--) {
          /* 在部分安卓设备上，因手机逻辑分辨率与rpx单位计算不是整数，滚动距离与有误差，增加2px来完善该问题 */
          if (top + 2 >= this.topArr[i]) {
            index = i;
            break;
          }
        }
        this.leftIndex = index < 0 ? 0 : index;
      };
    },
    /* 左侧导航点击 */
    leftTap(e) {
      const index = e.currentTarget.dataset.index;

      if (this.filterList.length - 1 === this.leftIndex) {
        this.leftIndex = index;
      }

      this.scrollInto = `item-${index}`;
    },
    selectHandle(item, item2) {
      if (this.filterParams[item.value].includes(item2.value)) {
        this.filterParams[item.value].splice(this.filterParams[item.value].indexOf(item2.value), 1);
      } else {
        if (item.type === 'selector') this.filterParams[item.value] = [];
        this.filterParams[item.value].push(item2.value);
      }

      if (item.value === 'priceFilter') {
        this.selectPrice({
          low: item2.value.split('-')[0],
          high: item2.value.split('-')[1],
        });
      }
    },
    inputChange(e, item, propName) {
      const value = e.detail.value;
      this.priceValue[propName] = value;
      this.filterParams[item.value] = [`${this.priceValue?.low || 0}-${this.priceValue?.high || 0}`];
    },
    // 价格选择
    selectPrice(item) {
      if (this.priceValue.low === item.low && this.priceValue.high === item.high) {
        this.priceValue = {};
      } else {
        this.priceValue = { ...item };
      }
    },
    // 重置
    resetFilter() {
      Object.entries(this.filterParams).forEach(([key, value]) => {
        if (value?.length) {
          this.filterParams[key] = [];
        }
      });
      cacheManager.delete('filterParams');
    },
    // 更多筛选 确认
    confirmFilter() {
      const params = {};
      Object.entries(this.filterParams).forEach(([key, value]) => {
        if (value?.length) {
          params[key] = value.join(',');
        }
      });
      // 缓存48小时
      if (this.isDefaultSave) {
        cacheManager.set('filterParams', this.filterParams, 60 * 60 * 48);
      }
      this.$emit('confirm', params);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .index-anchor {
  padding-left: 10rpx !important;
}
::v-deep .index-list__sidebar .index-list__item {
  width: 28rpx !important;
  height: 28rpx !important;
  font-size: 22rpx !important;
}

::v-deep .index-list__content {
  height: 60vh !important;
}

.tooltip {
  position: absolute;
  top: 50rpx;
  left: -100rpx;
  z-index: 12;
  width: calc(100vw - 188rpx - 50rpx);
  min-width: 100%;
  overflow-y: unset !important;
  color: var(--snake-color-primary, #06D290);
}

.tooltip::before {
  position: absolute;
  top: -10rpx;
  left: 112rpx;
  width: 0;
  height: 0;
  content: '';
  border-right: 8px solid transparent;
  border-bottom: 8px solid var(--snake-color-primary-light, #eafff5);
  border-left: 8px solid transparent;
}

.filter-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--snake-color-surface, #fff);

  & > view {
    width: 100%;
  }

  .scroll-panel {
    flex-grow: 1;
    height: 0;
    overflow: hidden;
  }
}

.list-box {
  display: flex;
  flex-direction: row;
  font-size: 28rpx;

  .left {
    box-sizing: border-box;
    width: 188rpx;
    line-height: normal;
    background: var(--snake-color-background, #f6f6f6);

    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80rpx;
      font-family: PingFangSC-Regular;
      font-size: 26rpx;
      font-weight: 400;
      color: var(--snake-color-text-secondary, #707184);

      &.active {
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: var(--snake-color-primary, #06D290);
      }
    }

    .fill-last {
      width: 100%;
      height: 0;
      background: none;
    }
  }
  .main {
    box-sizing: border-box;
    flex-grow: 1;
    width: 0;
    padding-left: 20rpx;
    background-color: var(--snake-color-surface, #fff);

    .title {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      font-family: PingFangSC-Medium;
      font-size: 26rpx;
      font-weight: 500;
      line-height: normal;
      color: var(--snake-color-text, #26273a);
      background-color: var(--snake-color-surface, #fff);
    }

    .tabs {
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      align-items: center;
      justify-content: flex-start;

      .tabs-item {
        box-sizing: border-box;
        width: 166rpx;
        height: 60rpx;
        margin-right: 10rpx;
        margin-bottom: 10rpx;
        font-family: PingFangSC-Regular;
        font-size: 24rpx;
        font-weight: 400;
        line-height: 60rpx;
        text-align: center;
        background: var(--snake-color-surface-muted, #f6f6f6);
        border: 1px solid var(--snake-color-border, #f6f6f6);
        border-radius: 2rpx;
      }

      .tabs-item--active {
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: var(--snake-color-primary, #06D290);
        background: var(--snake-color-primary-light, #e8f8f2);
        border: 1px solid var(--snake-color-primary, #06D290);
      }
    }
  }
}

.filter-footer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 116rpx;
  padding: 0 22rpx;
  background: var(--snake-color-surface, #fff);
  box-shadow: 0 -4px 12px 0 var(--snake-color-shadow, #00000008);

  .action {
    display: flex;
    align-items: center;
  }
}

.price-input-box {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .price-input-item {
    box-sizing: border-box;
    width: 229rpx;
    height: 60rpx;
    font-size: 26rpx;
    color: var(--snake-color-text-muted, #acacb7);
    text-align: center;
    background-color: var(--snake-color-surface-muted, #f6f6f6);
    border-radius: 2rpx;
  }
  .line {
    width: 24rpx;
    height: 4rpx;
    margin: 0 20rpx;
    background-color: #000;
  }
}
</style>
