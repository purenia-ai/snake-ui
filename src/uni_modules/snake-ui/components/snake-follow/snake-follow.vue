<template>
  <view>
    <!-- #ifdef MP-WEIXIN -->
    <official-account></official-account>
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
/**
 * @component Follow
 * @description 在微信小程序环境中展示官方账号关注组件。
 */

defineOptions({ name: 'Follow', options: { virtualHost: true, styleIsolation: 'shared' } });
</script>

<style></style>
