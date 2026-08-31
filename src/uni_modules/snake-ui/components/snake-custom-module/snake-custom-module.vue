<template>
  <view class="custommodule" :style="$snakeThemeStyle">
    <!-- <slot :name="datas.slotName" /> -->
    <slot />
  </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeCustomModule
 * @description 为 CMS 配置中的自定义内容提供一个通用插槽容器。
 * @see /components/custom-module
 */

import type { SnakeCustomModuleProps, SnakeCustomModuleSlots } from './types';

defineOptions({ name: 'SnakeCustomModule' });
withDefaults(defineProps<SnakeCustomModuleProps>(), { datas: () => ({}) });
defineSlots<SnakeCustomModuleSlots>();
</script>

<style scoped lang="scss">
.custommodule {
  height: 100%;
}
</style>
