<template>
    <!-- #ifdef H5 -->
    <!-- H5 端使用 teleport 把内容传送到 body -->
    <teleport to="body">
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
        <!-- #ifndef MP-DINGTALK -->
        <!-- 微信/支付宝小程序使用原生 root-portal 组件传送 -->
        <root-portal>
            <!-- #endif -->
            <!-- #endif -->
            <view
                :class="['snake-root-portal', `snake-theme-${mode}`, props.customClass]"
                :data-snake-theme-mode="mode"
                :style="[themeStyle, props.customStyle]"
            >
                <slot />
            </view>
            <!-- #ifdef MP-WEIXIN || MP-ALIPAY -->
            <!-- #ifndef MP-DINGTALK -->
        </root-portal>
        <!-- #endif -->
        <!-- #endif -->
        <!-- #ifdef H5 -->
    </teleport>
    <!-- #endif -->
</template>

<script lang="ts">
export default {
    name: 'RootPortal',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
};
</script>

<script setup lang="ts">
/**
 * @component RootPortal
 * @description 根节点传送组件：把插槽内容渲染到页面根节点，避免被祖先的 transform、overflow 或层叠上下文影响，解决复杂布局下 fixed 弹层失效的问题。H5 端使用 teleport，微信/支付宝小程序端使用原生 root-portal，App 端通过 renderjs 移动节点，其余平台原位渲染。
 * @see /components/root-portal
 */
import { computed } from 'vue';
import { darkMode, systemDark, themeStyle } from '../../libs/config/theme';
import type { RootPortalProps } from './types';

const props = defineProps<RootPortalProps>();

// 传送后的内容脱离 snake-config-provider 的子树，需在内层容器重新携带主题变量与暗色 class
const mode = computed<'light' | 'dark'>(() =>
    darkMode.value === 'auto' ? (systemDark.value ? 'dark' : 'light') : darkMode.value
);
</script>

<!-- #ifdef APP-PLUS -->
<script module="render" lang="renderjs">
export default {
    mounted() {
        const ownerInstance = this.$ownerInstance;
        if (!ownerInstance || !ownerInstance.$el) return;

        const root = document.querySelector('uni-app') || document.body;
        root.appendChild(ownerInstance.$el);
    },
    beforeUnmount() {
        const ownerInstance = this.$ownerInstance;
        if (!ownerInstance || !ownerInstance.$el) return;

        const root = document.querySelector('uni-app') || document.body;
        if (ownerInstance.$el.parentNode === root) root.removeChild(ownerInstance.$el);
    }
};
</script>
<!-- #endif -->

<style lang="scss" scoped></style>
