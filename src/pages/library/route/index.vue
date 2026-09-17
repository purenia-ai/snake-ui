<template>
    <DemoPage :title="text('路由跳转')" :desc="text('Promise 化的 uni-app 导航')">
        <view class="path">/pages/componentsA/button/index?id=7</view>
        <snake-button type="primary" @click="openButton">{{ text('打开 Button 示例') }}</snake-button>
        <text class="log">{{ log || text('尚未导航') }}</text>
    </DemoPage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../../common/demo-i18n';
import { route } from '../../../uni_modules/snake-ui';

const { text } = useDemoLocale();
const log = ref('');
async function openButton() {
    try {
        await route('/pages/componentsA/button/index', { source: 'route-demo', id: 7 });
        log.value = text('navigateTo 调用成功');
    } catch (error) {
        log.value = error instanceof Error ? error.message : String(error);
    }
}
</script>

<style scoped>
.path {
    margin: 8px 4px 16px;
    padding: 13px;
    border: 1px dashed var(--snake-color-border);
    border-radius: 7px;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface-muted);
    font-family: monospace;
    font-size: 12px;
}
.log {
    display: block;
    margin: 16px 4px;
    color: var(--snake-color-text-muted);
    font-size: 13px;
}
</style>
