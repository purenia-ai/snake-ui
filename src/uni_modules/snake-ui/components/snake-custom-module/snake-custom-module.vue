<template>
  <view class="custommodule" :style="$snakeThemeStyle">
    <!-- <slot :name="datas.slotName" /> -->
    <slot />
  </view>
</template>

<script>
export default {
  name: 'snake-custom-module',
  props: {
    datas: Object,
  },
};
</script>

<style scoped lang="scss">
.custommodule {
  height: 100%;
}
</style>
