<template>
  <view class="custommodule" :style="$snakeThemeStyle">
    <!-- <slot :name="datas.slotName" /> -->
    <slot />
  </view>
</template>

<script setup lang="ts">
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
