<template>
  <view class="custommodule">
    <!-- <slot :name="datas.slotName" /> -->
    <slot />
  </view>
</template>

<script setup lang="ts">
/**
 * @component CustomModule
 * @description 为 CMS 配置中的自定义内容提供一个通用插槽容器。
 */

import type { CustomModuleProps, CustomModuleSlots } from './types';

defineOptions({ name: 'CustomModule', options: { virtualHost: true, styleIsolation: 'shared' } });
withDefaults(defineProps<CustomModuleProps>(), { datas: () => ({}) });
defineSlots<CustomModuleSlots>();
</script>

<style scoped lang="scss">
.custommodule {
  height: 100%;
}
</style>
