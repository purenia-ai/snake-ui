<template>
  <view :style="$snakeThemeStyle">
    <!-- #ifdef MP-WEIXIN -->
    <official-account></official-account>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  name: 'snake-follow',
};
</script>

<style></style>
