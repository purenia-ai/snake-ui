<template>
  <view class="richtext" :style="$snakeThemeStyle">
    <mp-html :content="datas.myValue"></mp-html>
  </view>
</template>

<script>
export default {
  name: 'snake-rich-text',
  props: {
    datas: {
      type: [Object, null],
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      tagStyle: {
        pre: 'white-space: unset !important;',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.richtext {
  padding: 0 20rpx;
  white-space: break-word !important;
}
// ::v-deep .ace-line {
//   white-space: unset !important;
// }
// ::v-deep span {
//   word-break: break-word !important;
// }
</style>
