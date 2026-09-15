<template>
    <ConfigProvider>
        <slot />
    </ConfigProvider>
</template>

<script setup lang="ts">
/**
 * 应用级虚拟根组件(由 vite-plugin-snake-root 自动包裹到每个页面模板)。
 * 借助 snake-config-provider 把主题引擎的 CSS 变量内联到页面根部并携带暗色 class,
 * 使明暗主题切换对所有页面内容生效(H5 与小程序行为一致)。
 * <slot /> 是页面内容的渲染位置,必须保留。
 */
import ConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>
