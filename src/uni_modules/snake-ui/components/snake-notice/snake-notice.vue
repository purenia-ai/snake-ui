<template>
  <view :style="$snakeThemeStyle">
    <snake-notice-bar
      :volume-icon="datas.isLeftIcon ? true : false"
      :list="
        datas.direction === 'row'
          ? Array.isArray(noticeText)
            ? datas.noticeText
            : [datas.noticeText]
          : Array.isArray(textList)
            ? datas.noticeText
            : [textList]
      "
      :bg-color="datas.backColor"
      :mode="datas.direction === 'row' ? 'horizontal' : 'vertical'"
      :color="datas.textColor"
      :custom-style="{
        height: (datas.height || 72) + 'rpx',
        lineHeight: (datas.height || 72) + 'rpx',
        padding: `0 ${datas.pageMargin}rpx`,
      }"
      @click="handleNotice" />
  </view>
</template>

<script>
export default {
  name: 'notice',
  props: {
    datas: {
      type: [Object, null],
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    // 热词列表
    textList() {
      return this.datas.textList.map((el) => el.text);
    },
  },
  methods: {
    // 公告跳转
    handleNotice(e) {
      if (this.datas.direction === 'row') {
        uni.$snake.navTo(this.datas.url);
      } else {
        uni.$snake.navTo(this.datas.textList[e].url);
      }
    },
  },
};
</script>

<style></style>
