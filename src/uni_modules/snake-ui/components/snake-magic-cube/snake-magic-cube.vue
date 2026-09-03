<template>
  <view
    class="magiccube"
    :style="{
      'padding-left': datas.pageMargin + 'rpx',
      'padding-right': datas.pageMargin + 'rpx',
      background: datas.bgColor,
    }"
    v-if="datas.imageTypeObj">
    <!-- 一行最多6个 -->
    <section class="buju buju0" v-if="datas.rubiksCubeType === 0">
      <view
        class="rubiksCubeType rubiksCubeType0"
        v-for="(item, index) in datas.rowNum"
        :key="index"
        :style="{ width: 100 / datas.rowNum + '%' }">
        <view
          class="image"
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][index] &&
            datas.imageTypeObj[datas.rubiksCubeType][index].length
          "
          :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index]),
              interval: datas.interval,
            }"></pictureads>
        </view>
      </view>
    </section>

    <!-- 二左二右 -->
    <section class="buju buju0" v-if="datas.rubiksCubeType === 1">
      <view class="rubiksCubeType rubiksCubeType1" v-for="(item, index) in 4" :key="index" :style="heightStyle">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][index] &&
            datas.imageTypeObj[datas.rubiksCubeType][index].length
          "
          :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index]),
              interval: datas.interval,
            }"></pictureads>
        </view>
      </view>
    </section>

    <!-- 一左二右 -->
    <view class="buju buju2" :style="[heightStyle]" v-if="datas.rubiksCubeType === 2">
      <view class="rubiksCubeType rubiksCubeType2">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', paddingRight: `${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
              interval: datas.interval,
            }"></pictureads>
        </view>
      </view>
      <view style="display: flex; flex-direction: column; justify-content: space-between; width: 100%">
        <block v-for="(item, index) in 2" :key="index">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1].length
            ">
            <pictureads
              :datas="{
                swiperType: 1,
                height: datas.heights / 2 - datas.imgMargin / 2,
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 1]),
                interval: datas.interval,
              }"></pictureads>
          </view>
        </block>
      </view>
    </view>

    <!-- 一上二下 -->
    <section class="buju buju5" v-if="datas.rubiksCubeType === 3" :style="[heightStyle]">
      <view class="rubiksCubeType hw" :style="{ height: datas.topHeight + '%' }">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx ${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights * (datas.topHeights / 100),
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
              interval: datas.interval,
            }"></pictureads>
        </view>
      </view>
      <view style="display: flex; width: 100%" :style="{ height: 100 - datas.topHeights + '%' }">
        <view class="rubiksCubeType hw imgtow" v-for="(item, index) in 2" :key="index">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1].length
            "
            :style="{ width: '100%', padding: `${datas.imgMargin}rpx ${datas.imgMargin}rpx 0` }">
            <pictureads
              :datas="{
                swiperType: 1,
                height: datas.heights * ((100 - datas.topHeights) / 100),
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 1]),
                interval: datas.interval,
              }"></pictureads>
          </view>
        </view>
      </view>
    </section>

    <!-- 一左三右 -->
    <section class="buju buju4" :style="heightStyle" v-if="datas.rubiksCubeType === 4">
      <!-- 左侧 -->
      <view class="rubiksCubeType hw">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', paddingRight: `${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
              interval: datas.interval,
            }"></pictureads>
        </view>
      </view>
      <!-- 右侧 -->
      <view style="display: flex; flex-direction: column; width: 100%">
        <view class="rubiksCubeType hw" :style="{ height: datas.topHeights + '%' }">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][1] &&
              datas.imageTypeObj[datas.rubiksCubeType][1].length
            "
            :style="{ width: '100%' }">
            <pictureads
              :datas="{
                swiperType: 1,
                height: (datas.heights - datas.imgMargin) * (datas.topHeights / 100),
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][1]),
                interval: datas.interval,
              }"></pictureads>
          </view>
        </view>
        <view class="rubiksCubeType">
          <view
            class="hw"
            style="display: flex; align-items: center; justify-content: center"
            v-for="(item, index) in 2"
            :key="index">
            <view
              v-if="
                datas.imageTypeObj[datas.rubiksCubeType] &&
                datas.imageTypeObj[datas.rubiksCubeType][index + 2] &&
                datas.imageTypeObj[datas.rubiksCubeType][index + 2].length
              "
              :style="{
                width: '100%',
                paddingTop: datas.imgMargin + 'rpx',
                paddingRight: index == 0 ? datas.imgMargin + 'rpx' : 0,
              }">
              <pictureads
                :datas="{
                  swiperType: 1,
                  height: (datas.heights - datas.imgMargin) * ((100 - datas.topHeights) / 100),
                  borderRadius: datas.borderRadius,
                  imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 2]),
                  interval: datas.interval,
                }"></pictureads>
            </view>
          </view>
        </view>
      </view>
    </section>

    <!-- 二左一右 -->
    <section class="buju buju4" v-if="datas.rubiksCubeType === 5">
      <view style="display: inline-flex; flex-direction: column; width: 100%">
        <view class="hw imgone" v-for="(item, index) in 2" :key="index" :style="{ height: datas.heights / 2 + 'rpx' }">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1] &&
              datas.imageTypeObj[datas.rubiksCubeType][index + 1].length
            "
            :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx` }">
            <pictureads
              :datas="{
                swiperType: 1,
                height: datas.heights / 2,
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 1]),
                interval: datas.interval,
              }"></pictureads>
          </view>
        </view>
      </view>
      <view class="rubiksCubeType hw">
        <!-- 左侧轮播 -->
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', padding: `0 ${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
              interval: datas.interval,
            }"></pictureads>
        </view>
      </view>
    </section>

    <!-- 三左一右 -->
    <section class="buju buju4" :style="heightStyle" v-if="datas.rubiksCubeType === 6">
      <!-- 左侧 -->
      <view style="display: flex; flex-direction: column; width: 100%" :style="heightStyle">
        <view class="rubiksCubeType hw" :style="{ height: datas.topHeights + '%' }">
          <view
            v-if="
              datas.imageTypeObj[datas.rubiksCubeType] &&
              datas.imageTypeObj[datas.rubiksCubeType][1] &&
              datas.imageTypeObj[datas.rubiksCubeType][1].length
            "
            :style="{ width: '100%' }">
            <pictureads
              :datas="{
                swiperType: 1,
                height: (datas.heights - datas.imgMargin) * (datas.topHeights / 100),
                borderRadius: datas.borderRadius,
                imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][1]),
                interval: datas.interval,
              }"></pictureads>
          </view>
        </view>
        <view class="rubiksCubeType">
          <view
            class="hw"
            style="display: inline-flex; align-items: center; justify-content: center"
            v-for="(item, index) in 2"
            :key="index">
            <view
              v-if="
                datas.imageTypeObj[datas.rubiksCubeType] &&
                datas.imageTypeObj[datas.rubiksCubeType][index + 2] &&
                datas.imageTypeObj[datas.rubiksCubeType][index + 2].length
              "
              :style="{
                width: '100%',
                paddingTop: datas.imgMargin + 'rpx',
                paddingRight: index == 0 ? datas.imgMargin + 'rpx' : 0,
              }">
              <pictureads
                :datas="{
                  swiperType: 1,
                  height: (datas.heights - datas.imgMargin) * ((100 - datas.topHeights) / 100),
                  borderRadius: datas.borderRadius,
                  imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][index + 2]),
                  interval: datas.interval,
                }"></pictureads>
            </view>
          </view>
        </view>
      </view>
      <!-- 右侧 -->
      <view class="rubiksCubeType hw">
        <view
          v-if="
            datas.imageTypeObj[datas.rubiksCubeType] &&
            datas.imageTypeObj[datas.rubiksCubeType][0] &&
            datas.imageTypeObj[datas.rubiksCubeType][0].length
          "
          :style="{ width: '100%', paddingLeft: `${datas.imgMargin}rpx` }">
          <pictureads
            :datas="{
              swiperType: 1,
              height: datas.heights,
              borderRadius: datas.borderRadius,
              imageList: imageList(datas.imageTypeObj[datas.rubiksCubeType][0]),
              interval: datas.interval,
            }"></pictureads>
        </view>
      </view>
    </section>
  </view>
</template>

<script>
/**
 * @component SnakeMagicCube
 * @description 按照预设类型将多张图片组合成 CMS 魔方区域，并支持按星期和每日时间段筛选素材。
 * @see /components/magic-cube
 */

import SnakePictureAds from '../snake-picture-ads/snake-picture-ads.vue';
import { pxToRpx } from '../../libs/function/unit';

export default {
  name: 'snake-magic-cube',
  options: { virtualHost: true, styleIsolation: 'shared' },
  props: { datas: Object },
  components: { pictureads: SnakePictureAds },
  computed: {
    imageList() {
      return (images) => {
        const showImageList = [];
        images
          .filter((item) => {
            const weeksToShow = item.weeks || [7, 1, 2, 3, 4, 5, 6]; // 默认显示周日到周六
            const currentWeekday = this.getWeekday(); // 获取当前是星期几
            const weeksResult = weeksToShow.includes(currentWeekday); // 判断当前星期几是否在显示列表中;
            return weeksResult;
          })
          .forEach((item) => {
            (item?.imageList || []).forEach((item2) => {
              if (item2.startTime && item2.endTime) {
                // 今天
                const today = new Date();
                // 当前时间戳
                const currentTime = Date.now();

                const startDate = new Date(item2.startTime);
                const endDate = new Date(item2.endTime);

                const startTime = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  startDate.getHours(),
                  startDate.getMinutes(),
                  startDate.getSeconds(),
                ).getTime();

                const endTime = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  endDate.getHours(),
                  endDate.getMinutes(),
                  endDate.getSeconds(),
                ).getTime();

                if (currentTime >= startTime && currentTime <= endTime) {
                  showImageList.push(item2);
                }
              }
            });
            if (!item?.imageList && item?.imageList?.length === undefined) {
              showImageList.push(item);
            }
          });
        return showImageList;
      };
    },
    heightStyle() {
      const style = {};
      style.height = pxToRpx(this.datas.heights);
      return style;
    },
  },
  methods: {
    // 获取当前是星期几
    getWeekday() {
      const date = new Date();
      // 星期天为7，星期一为1，依此类推
      const weekdays = [7, 1, 2, 3, 4, 5, 6];
      return weekdays[date.getDay()];
    },
    convertToTimestamp(timeStr) {
      // 验证输入是否为有效的时间字符串（HH:mm:ss 格式）
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;
      if (!timeRegex.test(timeStr)) {
        // 输入的时间字符串格式不正确
        return null;
      }
      // 将时间字符串拆分为小时和分钟
      const [hours, minutes, seconds = '0'] = timeStr.split(':').map(Number);

      // 创建一个新的 Date 对象，默认使用当天的日期
      const now = new Date();

      // 设置 Date 对象的小时和分钟为输入的时间
      now.setHours(hours, minutes, seconds, 0); // 参数依次为小时、分钟、秒、毫秒

      // 获取时间戳
      const timestamp = now.getTime();
      return timestamp;
    },
  },
};
</script>

<style scoped lang="scss">
.magiccube {
  position: relative;

  // 一左二右 布局
  .imgone {
    &:last-of-type {
      .image {
        padding-right: 0 !important;
        padding-bottom: 0 !important;
      }
    }

    &:first-of-type {
      .image {
        padding-top: 0 !important;
        padding-right: 0 !important;
      }
    }

    .image {
      box-sizing: border-box;
    }
  }

  // 一上二下 布局
  .imgtow {
    &:first-of-type {
      .image {
        padding-bottom: 0 !important;
        padding-left: 0 !important;
      }
    }

    &:last-of-type {
      .image {
        padding-right: 0 !important;
        padding-bottom: 0 !important;
      }
    }
  }

  .hw {
    position: relative;
    width: 100%;

    .image {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }
  }

  .buju {
    &.buju0 {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }

    &.buju2 {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
    }

    &.buju4 {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      width: 100%;
    }

    .rubiksCubeType {
      display: flex;
      align-items: center;
      justify-content: center;
      // cursor: pointer;

      // 一行多个
      &.rubiksCubeType0 {
        height: 100%;

        &:first-of-type {
          .image {
            padding-left: 0 !important;
          }
        }

        .image {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding-right: 0 !important;
        }
      }

      // 二左二右
      &.rubiksCubeType1 {
        position: relative;
        width: 50%;

        &:nth-of-type(1) {
          .image {
            padding-top: 0 !important;
            padding-left: 0 !important;
          }
        }

        &:nth-of-type(2) {
          .image {
            padding-top: 0 !important;
            padding-right: 0 !important;
          }
        }

        &:nth-of-type(3) {
          .image {
            padding-bottom: 0 !important;
            padding-left: 0 !important;
          }
        }

        &:nth-of-type(4) {
          .image {
            padding-right: 0 !important;
            padding-bottom: 0 !important;
          }
        }

        .image {
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
        }
      }

      &.rubiksCubeType2 {
        width: 100%;
      }
    }
  }
}
</style>
