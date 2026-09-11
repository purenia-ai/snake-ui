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

<script setup lang="ts">
/**
 * @component RootPortal
 * @description 根节点传送组件：把插槽内容渲染到页面根节点，避免被祖先的 transform、overflow 或层叠上下文影响，解决复杂布局下 fixed 弹层失效的问题。H5 端使用 teleport，微信/支付宝小程序端使用原生 root-portal，App 端通过 renderjs 移动节点，其余平台原位渲染。
 * @see /components/root-portal
 */
import { computed } from 'vue';
import { darkMode, systemDark, themeStyle } from '../../libs/config/theme';
import type { RootPortalProps } from './types';

defineOptions({
    name: 'RootPortal',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = defineProps<RootPortalProps>();

// 传送后的内容脱离 snake-config-provider 的子树，需在内层容器重新携带主题变量与暗色 class
const mode = computed<'light' | 'dark'>(() =>
    darkMode.value === 'auto' ? (systemDark.value ? 'dark' : 'light') : darkMode.value
);
</script>

<!-- #ifdef APP-PLUS -->
<script module="render" lang="renderjs">
// renderjs 运行在 webview 的 JS 环境，$ownerInstance 由框架注入，需显式 this 类型 vue-tsc 才能通过
interface RenderBridge {
    /** renderjs 桥接的宿主组件实例。 */
    $ownerInstance?: { $el?: HTMLElement };
}

/** App 端把组件根节点搬到应用根容器（attach）或移回原位，脱离原父级的 transform/overflow 布局。 */
function relocate(instance: RenderBridge, attach: boolean): void {
    const ownerInstance = instance.$ownerInstance;
    if (!ownerInstance || !ownerInstance.$el) return;

    const root = document.querySelector('uni-app') || document.body;
    if (attach) {
        root.appendChild(ownerInstance.$el);
    } else if (ownerInstance.$el.parentNode === root) {
        root.removeChild(ownerInstance.$el);
    }
}

export default {
    mounted(this: RenderBridge) {
        relocate(this, true);
    },
    // renderjs 沿用 Vue2 风格生命周期名（与参考实现一致），Vue3 的 eslint 规则在此不适用
    // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
    beforeDestroy(this: RenderBridge) {
        relocate(this, false);
    }
};
</script>
<!-- #endif -->

<style lang="scss" scoped></style>
