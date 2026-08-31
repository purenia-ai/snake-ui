<template>
  <view :style="$snakeThemeStyle">
    <!-- #ifdef MP-WEIXIN -->
    <official-account></official-account>
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
defineOptions({ name: 'SnakeFollow' });
</script>

<style></style>
